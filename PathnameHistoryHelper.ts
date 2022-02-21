import { _atob, _btoa } from './Base64';

// a callback for history events
export type PathnameHistoryNotifyer = (currentState: string) => void;


/**
 * A class for helping with the browser history
 *
 * @export
 * @class HistoryHelper
 */
export class PathnameHistory
{
    private currentUrlState: string = window.location.pathname;
    private notifyers: PathnameHistoryNotifyer[] = [];
    /**
     *Creates an instance of HistoryHelper.
     * @memberof HistoryHelper
     */
    constructor()
    {
        window.addEventListener("popstate", (_) =>
        {
            this.parseUrlState();
            this.notify();
        });
        this.parseUrlState();
    }

    public getCurrentPath()
    {
        return this.currentUrlState;
    }

    private parseUrlState()
    {
        this.currentUrlState = window.location.pathname;
    }

    private getUrl(newPath: string)
    {
        let url = new URL(window.location.href);
        url.pathname = newPath;
        return url.href;
    }

    public setUrlState(next: string)
    {
        this.setState(next, "pushState");
    }

    public replaceUrlState(next: string)
    {
        this.setState(next, "replaceState");
    }

    private setState(next: string, option: "pushState" | "replaceState")
    {
        let url = this.getUrl(next);
        window.history[option](this.currentUrlState, document.title, url);
        this.parseUrlState();
        this.notify();
    }

    private notify()
    {
        this.notifyers.forEach(notifier => { queueMicrotask(() => notifier(this.currentUrlState)); });
    }

    public on(notifyer: PathnameHistoryNotifyer)
    {
        this.notifyers.push(notifyer);
        return notifyer;
    }

    public off(notifyer: PathnameHistoryNotifyer)
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
}