import * as React from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Session } from 'next-auth';
import type { HttpClient } from '../../http-client/http-client';
import { ExistingPastaList } from './existing-pasta-list';
import { PastaEditable } from './pasta-editable';
import { useSession } from 'next-auth/react';
import { useHttpClient } from '../../http-client/consumer';
import { Cleanup } from '../../services/export';
import {
  useSubscriber,
  useDispatcher,
  makeBroadcastProvider,
} from '../../services/broadcast';

export class Store {
  private static readonly BroadcastProvider =
    makeBroadcastProvider('pasta:new');

  private readonly cleanupFns = new Array<Cleanup>();

  private readonly _newPasta: PastaEditable;

  private readonly _existingPastas: ExistingPastaList;

  public constructor(
    private readonly params: {
      httpClient: HttpClient;
      session: Session | null;
      dispatcher: ReturnType<typeof useDispatcher>;
      subscriber: ReturnType<typeof useSubscriber>;
    }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this._existingPastas = new ExistingPastaList({
      httpClient: params.httpClient,
      session: params.session,
      addCleanup: (cleanup) => {
        this.cleanupFns.push(cleanup);
      },
      onNewSaveError: () => {
        // TODO handle this
      },
      onReloadError: () => {
        // TODO handle this
      },
      onSaveNewSuccess: () => {
        this._newPasta.reset();
      },
    });
    this._newPasta = new PastaEditable({
      onSave: (pasta: PastaEditable) => {
        this._existingPastas.saveNew(pasta);
      },
      addCleanup: (cleanup) => {
        this.cleanupFns.push(cleanup);
      },
      dispatcher: params.dispatcher,
      subscriber: params.subscriber,
    });
  }

  public get existingPastaList() {
    return this._existingPastas.list;
  }

  public get newPasta() {
    return this._newPasta;
  }

  public resetNewPasta() {
    this._newPasta.setContent('');
    this._newPasta.setName('');
    this._newPasta.setEncrypted(false);
  }

  public get canBeDownloaded() {
    return this._newPasta.canBeSaved;
  }

  public get canBeSaved() {
    return Boolean(this.params.session) && this._newPasta.canBeSaved;
  }

  private static Context = React.createContext<Store | null>(null);

  private static PastaStoreProvider(props: React.PropsWithChildren<object>) {
    const session = useSession().data;
    const httpClient = useHttpClient();
    const broadcastDispatcher = useDispatcher();
    const broadcastSubscriber = useSubscriber();
    const pastaStore = React.useMemo(() => {
      return new Store({
        session,
        httpClient,
        dispatcher: broadcastDispatcher,
        subscriber: broadcastSubscriber,
      });
    }, [
      session?.user?.email,
      httpClient,
      broadcastDispatcher,
      broadcastSubscriber,
    ]);

    React.useEffect(() => {
      pastaStore._existingPastas.reload();
      return () => {
        while (pastaStore.cleanupFns.length > 0) {
          pastaStore.cleanupFns.shift()?.cleanup();
        }
      };
    }, [pastaStore]);

    return (
      <Store.Context.Provider value={pastaStore}>
        {props.children}
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
