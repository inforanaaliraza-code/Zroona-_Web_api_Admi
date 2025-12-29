// Helper function to get day/week/month labels
const moment = require('moment');
const mongoose = require('mongoose');
const BookEventService = require('../services/bookEventService');
const TransactionService = require('../services/recentTransaction');
const generateDailyEarningsData = async (userId, lang) => {
    const daysOfWeek = lang === 'ar'
        ? ["أحد", "اثن", "ثلا", "أرب", "خم", "جمع", "سبت"]
        : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const todayIndex = moment().day();

    const earningsData = await TransactionService.AggregateService([
        {
            $match: {
                organizer_id: new mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: moment().subtract(6, 'days').startOf('day').toDate(),
                    $lte: moment().endOf('day').toDate()
                }
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: "$createdAt" },
                total_earning: { $sum: "$amount" }
            }
        }
    ]);

    const earningsMap = Array(7).fill(0);
    earningsData.forEach(item => {
        earningsMap[item._id - 1] = item.total_earning;
    });

    return daysOfWeek.map((day, index) => ({
        label: day,
        total_earning: earningsMap[(todayIndex + index) % 7] || 0
    }));
};

const generateWeeklyEarningsData = async (userId, lang) => {
    const week_label = lang === "ar" ? "أسبوع" : "Week";

    const earningsData = await TransactionService.AggregateService([
        {
            $match: {
                organizer_id: new mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: moment().startOf('month').toDate(),
                    $lte: moment().endOf('month').toDate()
                }
            }
        },
        {
            $group: {
                _id: { $floor: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] } },
                total_earning: { $sum: "$amount" }
            }
        }
    ]);

    return Array.from({ length: 4 }, (_, index) => {
        const weekData = earningsData.find(item => item._id === index);
        return {
            label: `${week_label} ${index + 1}`,
            total_earning: weekData ? weekData.total_earning : 0
        };
    });
};


const generateMonthlyEarningsData = async (userId, lang) => {
    const months = lang === 'ar'
        ? ["مح", "صف", "رب١", "رب٢", "جم١", "جم٢", "رجب", "شعب", "رمض", "شوا", "ذق", "ذح"]
        : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const earningsData = await TransactionService.AggregateService([
        {
            $match: {
                organizer_id: new mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: moment().startOf('year').toDate(),
                    $lte: moment().endOf('year').toDate()
                }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                total_earning: { $sum: "$amount" }
            }
        }
    ]);

    return months.map((month, index) => {
        const monthData = earningsData.find(item => item._id === index + 1);
        return {
            label: month,
            total_earning: monthData ? monthData.total_earning : 0
        };
    });
};

const calculateTotalAttendees = async (userId) => {
    const total_attendees = await BookEventService.AggregateService([{ $match: { organizer_id: new mongoose.Types.ObjectId(userId) } }]);
    return total_attendees.reduce((sum, attendee) => sum + attendee.no_of_attendees, 0);
};

const calculateMonthlyAttendeeComparison = async (userId) => {
    const currentMonthTotal = await getMonthlyAttendees(userId, 0);
    const previousMonthTotal = await getMonthlyAttendees(userId, -1);

    const percentageChange = previousMonthTotal > 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0;
    const is_increased = currentMonthTotal > previousMonthTotal ? 1 : 0;

    return { currentMonthTotal, previousMonthTotal, percentageChange, is_increased };
};

const getMonthlyAttendees = async (userId, monthOffset) => {
    const start = moment().add(monthOffset, 'month').startOf('month').toDate();
    const end = moment().add(monthOffset, 'month').endOf('month').toDate();

    const data = await BookEventService.AggregateService([
        {
            $match: {
                organizer_id: new mongoose.Types.ObjectId(userId),
                createdAt: { $gte: start, $lt: end }
            }
        },
        { $group: { _id: null, totalAttendees: { $sum: 1 } } }
    ]);

    return data[0]?.totalAttendees || 0;
};

module.exports = {
    generateDailyEarningsData,
    generateWeeklyEarningsData,
    generateMonthlyEarningsData,
    calculateTotalAttendees,
    calculateMonthlyAttendeeComparison,
    getMonthlyAttendees
}