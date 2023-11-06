export default function numberAsCurrency(locale: string, iso4217code: string) {
    const option = {
        style: "currency",
        currency: iso4217code
    }
    return Intl.NumberFormat(locale, option);
}
