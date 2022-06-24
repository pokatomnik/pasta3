import * as React from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Session } from 'next-auth';
import type { HttpClient } from '../../http-client/http-client';
import { ExistingPastaList } from './existing-pasta-list';
import { PastaEditable } from './pasta-editable';
import { useSession } from 'next-auth/react';
import { useHttpClient } from '../../http-client/consumer';
import {
  useSubscriber,
  useDispatcher,
  makeBroadcastProvider,
} from '../../../lib/broadcast';
import type { Disposable } from '../../../lib/disposable';
import { DisposablesCollection } from '../../../lib/disposables-collection';
import { Export } from '../../services/export';
import { useSimpleSnack } from '../../ui/snack';

export class Store implements Disposable {
  private static readonly BroadcastProvider =
    makeBroadcastProvider('pasta:new');

  private disposed = false;

  private disposablesCollection = new DisposablesCollection();

  private readonly _newPasta: PastaEditable;

  private readonly _existingPastas: ExistingPastaList;

  public constructor(params: {
    httpClient: HttpClient;
    session: Session | null;
    dispatcher: ReturnType<typeof useDispatcher>;
    subscriber: ReturnType<typeof useSubscriber>;
    onReloadError: (e: unknown) => void;
    onSaveError: (e: unknown) => void;
  }) {
    makeAutoObservable(this, {}, { autoBind: true });

    const exportService = new Export({
      clipboardInitialization: {
        handleTextarea: (textarea) => {
          document.body.appendChild(textarea);
          return {
            isDisposed: false,
            dispose() {
              document.body.removeChild(textarea);
              this.isDisposed = true;
            },
          };
        },
      },
    });

    this._existingPastas = new ExistingPastaList({
      exportService,
      httpClient: params.httpClient,
      session: params.session,
      addDisposable: (disposable) => {
        this.disposablesCollection.addDisposable(disposable);
      },
      onNewSaveError: (e) => {
        params.onSaveError(e);
      },
      onReloadError: (e) => {
        params.onReloadError(e);
      },
      onSaveNewSuccess: () => {
        this._newPasta.reset();
      },
    });

    this._newPasta = new PastaEditable({
      exportService,
      onSave: (pasta: PastaEditable) => {
        this._existingPastas.saveNew(pasta);
      },
      addDisposable: (disposable) => {
        this.disposablesCollection.addDisposable(disposable);
      },
      dispatcher: params.dispatcher,
      subscriber: params.subscriber,
    });

    this.disposablesCollection.addDisposable(exportService);
  }

  public get existingPastaList() {
    return this._existingPastas;
  }

  public get newPasta() {
    return this._newPasta;
  }

  public dispose() {
    this.disposablesCollection.dispose();
    this.disposed = true;
  }

  public get isDisposed() {
    return this.disposed;
  }

  private static Context = React.createContext<Store | null>(null);

  private static PastaStoreProvider(props: React.PropsWithChildren<object>) {
    const session = useSession().data;

    const httpClient = useHttpClient();

    const broadcastDispatcher = useDispatcher();
    const broadcastSubscriber = useSubscriber();

    const { showSnack, snackJSX } = useSimpleSnack();

    const pastaStore = React.useMemo(() => {
      return new Store({
        session,
        httpClient,
        dispatcher: broadcastDispatcher,
        subscriber: broadcastSubscriber,
        onReloadError: () => {
          showSnack('Failed to fetch pasta');
        },
        onSaveError: () => {
          showSnack('Failed to save new pasta');
        },
      });
    }, [
      session?.user?.email,
      httpClient,
      broadcastDispatcher,
      broadcastSubscriber,
      showSnack,
    ]);

    React.useEffect(() => {
      pastaStore._existingPastas.reload();
      return () => {
        pastaStore.dispose();
      };
    }, [pastaStore]);

    return (
      <Store.Context.Provider value={pastaStore}>
        {props.children}
        {snackJSX}
      </Store.Context.Provider>
    );
  }

  public static modelProvider<P extends object>(
    Component: React.ComponentType<P>
  ) {
    function Wrapped(props: P) {
      return (
        <Store.BroadcastProvider>
          <Store.PastaStoreProvider>
            <Component {...props} />
          </Store.PastaStoreProvider>
        </Store.BroadcastProvider>
      );
    }
    Wrapped.displayName = Component.displayName;
    return Wrapped;
  }

  private static use() {
    const store = React.useContext(Store.Context);
    if (!store) {
      throw new Error('Missing Pasta store');
    }
    return store;
  }

  public static modelClient<P extends object>(
    Component: (props: P & { pastaStore: Store }) => JSX.Element
  ) {
    const WrappedComponent = observer(Component);
    return function ModelClient(props: P) {
      const store = Store.use();
      return <WrappedComponent {...props} pastaStore={store} />;
    };
  }
}
