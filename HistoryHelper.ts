import { _atob, _btoa } from './Base64';

// a strategy for parsing and serialising the history from and to the search params
export type HistoryStrategy<T extends Object> = [
    (params: URLSearchParams) => [keyof T, any],
    (params: T) => [keyof T, string]
];
// a callback for history events
export type HistoryNotifyer<T> = (currentState: T) => void;
// a callback for generating the full history object invoked by Array.prototype.reduce
export type HistoryMerger<T> = (old: Partial<T>, next: Partial<T>) => T;


/**
 * A class for helping with the browser history
 *
 * @export
 * @class HistoryHelper
 */
export class HistoryHelper<T extends Object>
{
    private currentUrlState: T;
    private notifyers: HistoryNotifyer<T>[] = [];
    private merger: HistoryMerger<T>;
    private strategies: HistoryStrategy<T>[];
    /**
     *Creates an instance of HistoryHelper.
     * @memberof HistoryHelper
     */
    constructor(merger: HistoryMerger<T>, strategies: HistoryStrategy<T>[])
    {
        window.addEventListener("popstate", (_) =>
        {
            this.parseUrlState();
            this.notify();
        });
        this.strategies = strategies;
        this.merger = merger;
        this.parseUrlState();
    }

    public getCurrentURLState()
    {
        return this.currentUrlState;
    }

    private parseUrlState()
    {
        try
        {

            let searchParams = new URLSearchParams(window.location.search);
            let urlstate =
                this.strategies
                    .map((strategy) => strategy[0](searchParams))
                    .map(res => { return ({ [res[0]]: res[1] } as Partial<T>); })
                    .reduce(this.merger) as T;

            this.currentUrlState = urlstate;
        } catch (error)
        {
            console.error("Cannot parse URL-Search-String", error);
        }
    }

    private getUrl()
    {
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams();
        let params = this.strategies.map(strategy => strategy[1](this.currentUrlState));
        params = params.filter(param => isNil(param[1]) == false); //only populate fields with values
        params.forEach(param => searchParams.set(param[0].toString(), param[1]));
        url.search = searchParams.toString();
        return url.href;
    }

    public setUrlState(next: Partial<T>)
    {
        this.setState(next, "pushState");
    }

    public replaceUrlState(next: Partial<T>)
    {
        this.setState(next, "replaceState");
    }

    private setState(next: Partial<T>, option: "pushState" | "replaceState")
    {
        this.currentUrlState = this.merger(this.currentUrlState, next);
        let search = this.getUrl();
        window.history[option](this.currentUrlState, document.title, search);
        this.notify();
    }

    private notify()
    {
        this.notifyers.forEach(notifier => { queueMicrotask(() => notifier(this.currentUrlState)); });
    }

    public on(notifyer: HistoryNotifyer<T>)
    {
        this.notifyers.push(notifyer);
        return notifyer;
    }

    public off(notifyer: HistoryNotifyer<T>)
    {
        this.notifyers = this.notifyers.filter(_notifyer => _notifyer != notifyer);
    }

    public back()
    {
        window.history.back();
    }

    public forward()
    {
        window.history.forward();
    }

    public addStrategy(strategy: HistoryStrategy<T>)
    {
        this.strategies.push(strategy);
    }

}


function isNil(arg: any)
{
    return arg == undefined || arg == null;
}