export default function convert24to12(time24: string) {
    let [hours, minutes] = time24.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    minutes = +minutes < 10 ? Number(`0${minutes}`) : minutes;
    return `${hours}:${minutes} ${period}`;
}


