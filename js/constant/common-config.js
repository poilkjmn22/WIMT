const PAGE_SIZES = [15, 25, 50, 75, 100, 200]

const pickerOptions = {
    disabledDate: function(time) {
        return false;
    },
    shortcuts: [{
        text: '今天',
        onClick(picker) {
            const start = Date.today();
            picker.$emit('pick', start);
        }
    }, {
        text: '昨天',
        onClick(picker) {
            const start = Date.yesterday();
            picker.$emit('pick', start);
        }
    }, {
        text: '一周前',
        onClick(picker) {
            const start = Date.today().add({
                days: -7
            });
            picker.$emit('pick', start);
        }
    }, {
        text: '两周前',
        onClick(picker) {
            const start = Date.today().add({
                days: -14
            });
            picker.$emit('pick', start);
        }
    }, {
        text: '一个月前',
        onClick(picker) {
            const start = Date.today().add({
                months: -1
            });
            picker.$emit('pick', start);
        }
    }, {
        text: '三个月前',
        onClick(picker) {
            const start = Date.today().add({
                months: -3
            });
            picker.$emit('pick', start);
        }
    }]
}

const CHART_COLORS = ['#4891FE', '#25C8C9', '#03DA91', '#FDD124', '#FD9E24']
const BLUE_COLORS = ["#d5e8f6", "#93c2f9", "#6db0ff", "#4a90e2", "#76ddfb"]

export {
  PAGE_SIZES,
  pickerOptions,
  CHART_COLORS,
  BLUE_COLORS
}
