import * as React from 'react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Session } from 'next-auth';
import type { HttpClient } from '../../http-client/http-client';
import { ExistingPastaList } from './existing-pasta-list';
import { PastaEditable } from './pasta-editable';
import { useSession } from 'next-auth/react';
import { useHttpClient } from '../../http-client/consumer';

export class Store {
  private readonly _newPasta: PastaEditable;

  private readonly _existingPastas: ExistingPastaList;

  public constructor(
    private readonly params: {
      httpClient: HttpClient;
      session: Session | null;
    }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this._existingPastas = new ExistingPastaList({
      httpClient: params.httpClient,
      session: params.session,
      onNewSaveError: this.handleSaveError,
      onReloadError: this.handleReloadError,
      onSaveNewSuccess: this.handleSaveNewSuccess,
    });
    this._newPasta = new PastaEditable({
      onSave: this.handleSaveNew,
    });
  }

  private handleSaveNew(pasta: PastaEditable) {
    this._existingPastas.saveNew(pasta);
  }

  private handleSaveError() {}

  private handleReloadError() {}

  private handleSaveNewSuccess() {
    this._newPasta.setName('');
    this._newPasta.setContent('');
  }

  private reloadExistingPasta() {
    this._existingPastas.reload();
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
  }

  public get canBeSaved() {
    return Boolean(this.params.session) && this._newPasta.canBeSaved;
  }

  private static Context = React.createContext<Store | null>(null);

  private static PastaStoreProvider(props: React.PropsWithChildren<object>) {
    const session = useSession().data;
    const httpClient = useHttpClient();
    const pastaStore = React.useMemo(() => {
      return new Store({ session, httpClient });
    }, [session, httpClient]);

    React.useEffect(() => {
      pastaStore.reloadExistingPasta();
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
        <Store.PastaStoreProvider>
          <Component {...props} />
        </Store.PastaStoreProvider>
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
