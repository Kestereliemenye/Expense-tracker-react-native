export const getLast7days = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - 1)
        result.push({
            day: daysOfWeek[date.getDay()],
            date: date.toISOString().split("T")[0], 
            income: 0,
            expense: 0
        });

    }
    return result.reverse()
    // returns arrya of all previous 7 days
};