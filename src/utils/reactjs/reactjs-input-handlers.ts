import { normalizeTimezone } from '@/utils';
import IMask from 'imask';

export function handleDate(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): Date {
    var date = new Date(e.target.value);
    if (Number.isNaN(date.getTime())) return undefined as any;
    return normalizeTimezone(date);
}

export function handleNumber(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, min?: number, max?: number): number {
    if (e.target.value == null || Number.isNaN(e.target.value)) return undefined as any;
    let number = +e.target.value;
    if (min != null && number < min) number = min;
    if (max != null && number > max) number = max;
    return number; // TODO: fix trailling zeros (e.g. unable to insert 123.406)
}

export function handleAny(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): any {
    return e.target.value;
}

export function handlePhone(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const value = e.target.value?.replace(/\D/g, '');

    if (value == null) return '';

    // var phoneMask = new IMask.Masked({
    //     mask: '(00) [0]0000-0000',
    // });

    var phoneMask = IMask.createMask({
        mask: '(00) 00000-0000',
    });

    const phone = phoneMask.resolve(value);

    return phone;
}

export function handleMail(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const value = e.target.value;

    if (value == null) return '';

    var mailMask = IMask.createMask({
        mask: /^\S*@?\S*$/,
    });

    const mail = mailMask.resolve(value);

    return mail;
}

export function handleCpf(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const value = e.target.value?.replace(/\D/g, '');

    if (value == null) return '';

    var cpfMask = IMask.createMask({
        mask: '000.000.000-00',
    });

    const cpf = cpfMask.resolve(value);

    return cpf;
}

export function validEmail(email: string) {
    return email != null && /^\S+@\S+$/.test(email);
}

export function validCpf(cpf: string) {
    if (cpf == null) return false;
    cpf = cpf.replace(/\D/g, '');
    if(cpf.toString().length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9, 10].forEach(j => {
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0, j).forEach((e, i) => {
            soma += parseInt(e) * ((j + 2) - (i + 1));
        });
        r = soma % 11;
        r = (r < 2) ? 0 : 11 - r;
        if(r !== +cpf.substring(j, j + 1)) result = false;
    });
    return result;
}
