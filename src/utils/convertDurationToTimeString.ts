export function convertDurationToTimeString(duration: Number)
{
    const hours = Math.floor(<any>duration / 3600);
    const minutes = Math.floor((<any>duration % 3600) / 60);
    const seconds = <any>duration % 60;

    const timeString = [hours, minutes, seconds].map(unit => String(unit).padStart(2, "0")).join(":");

    return timeString;
}