// Short, human-friendly order reference, e.g. "ANO-K3F9Q7X".
// 4 characters from the timestamp + 3 random characters (base 36, upper case).
export function createOrderRef(now: number = Date.now(), random: () => number = Math.random): string {
    const time = now.toString(36).slice(-4).padStart(4, '0')
    const rand = Math.floor(random() * 36 ** 3).toString(36).padStart(3, '0')
    return `ANO-${time}${rand}`.toUpperCase()
}
