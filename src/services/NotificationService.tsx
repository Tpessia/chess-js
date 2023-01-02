import { NotificationItem, NotificationType } from '@/models/common/NotificationItem';
import { rndNumber, tryParseJson } from '@/utils';
import axios from 'axios';
import clsx from 'clsx';
import { Slide, toast, ToastContainer, ToastOptions } from 'react-toastify';

// TODO: copy message on click and hold
// TODO: prevent pull to refresh when dismiss notification

export abstract class NotificationService {
    static ToastContainer: React.FC = () => <ToastContainer className="r-notification-container" limit={1} />;

    private static toastOptions = (...classes: string[]) => ({
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        closeButton: false,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        draggable: true,
        draggableDirection: 'x',
        draggablePercent: 50,
        className: clsx('r-notification', ...classes),
        bodyClassName: 'r-notification-body',
        progressClassName: 'r-notification-progress',
        transition: Slide,
    }) as Partial<ToastOptions>;

    static async info(msg: string) {
        console.log(msg);

        if (typeof(msg) !== 'string')
            msg = JSON.stringify(msg);

        toast(msg, NotificationService.toastOptions('r-notification-info'));

        await this.histAdd(msg, NotificationType.Info);
    }

    static async error(err: any) {
        if (err?.message === 'Request aborted') return;

        console.error(err);

        let errMsg = err?.message || err?.toString() || err;

        if (err && axios.isAxiosError(err)) {
            if (err.response?.data?.errorId)
                errMsg = `Erro! Notifique os administradores e envie o seguinte Id: ${err.response.data.errorId}`;
            if (err.response?.data?.error)
                errMsg = err.response.data.error;
        }
        
        if (/timeout of .* exceeded/.test(errMsg))
            errMsg = 'Timeout error';

        if (typeof(errMsg) !== 'string')
            errMsg = JSON.stringify(errMsg);

        toast(errMsg, NotificationService.toastOptions('r-notification-error'));

        await this.histAdd(errMsg, NotificationType.Error);
    }

    static async histGetAll() {
        let notificationsHistStr = localStorage.getItem('notifications');

        let notificationsHist = tryParseJson<NotificationItem[]>(notificationsHistStr);
        if (!notificationsHist) notificationsHist = [];

        notificationsHist = notificationsHist.filter(e => typeof(e.message) === 'string');
        notificationsHist = notificationsHist.map(e => ({ ...e, date: new Date(e.date) }));
        notificationsHist = notificationsHist.sort((a, b) => a.date.getTime() > b.date.getTime() ? -1 : 1);

        return notificationsHist;
    }

    static async histRemove(id: number) {
        let notificationsHist = await this.histGetAll();
        notificationsHist = notificationsHist.filter(e => e.id !== id);
        await this.histSave(notificationsHist);
    }

    private static async histSave(notificationsHist: NotificationItem[]) {
        const notificationsHistStr = JSON.stringify(notificationsHist);
        localStorage.setItem('notifications', notificationsHistStr);
    }

    private static async histAdd(msg: string, type: NotificationType) {
        const notification: NotificationItem = {
            id: rndNumber(),
            type: type,
            message: msg,
            date: new Date(),
        };

        const notificationsHist = await this.histGetAll();
        notificationsHist.push(notification);
        await this.histSave(notificationsHist);
    }
}
