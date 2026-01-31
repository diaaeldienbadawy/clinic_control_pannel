
export class Scroling{
    public static scrollToTop(isSmooth:ScrollBehavior | undefined = 'smooth') {
        document.getElementById('nav-bar')?.scrollIntoView({
            behavior:isSmooth
        });
    }
}


export type Day = 'السبت'|'الأحد'|'الاثنين'|'الثلاثاء'|'الأربعاء'|'الخميس'|'الجمعة'
export type TimePeriod = 'ص'|'م'

export class DateTime{
    public static getDatesOfWeaklyDay(day:Day){
        var options: Intl.DateTimeFormatOptions = { weekday: 'short' };
        var date = new Date()
        var list :string[] = []
        var i =0 
        while(list.length < 5 && i < 31){
            if(date.toLocaleDateString('ar-EG',options) === day)list.push(date.toISOString().split('T')[0]);
            date.setDate(date.getDate()+1);
            i = i+1
        }
        

        return list
    }

    public static getDayFromShort(short:string){
        switch(short){
            case 'Sat':return 'السبت'
            case 'Sun':return 'الأحد'
            case 'Mon':return 'الاثنين'
            case 'Tue':return 'الثلاثاء'
            case 'Wed':return 'الأربعاء'
            case 'Thu':return 'الخميس'
            case 'Fri':return 'الجمعة'
            default:return ''
        }
    }

    public static formatTimeToArabic12Hour = (time24: string): string => {
        // تقسيم الوقت إلى ساعات ودقائق
        const [hours, minutes] = time24.split(":").map(Number);
      
        // إنشاء كائن Date وهمي لضبط الوقت
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
      
        // تحويل الوقت إلى 12 ساعة باللغة العربية
        return date.toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      public static formatDateToArabic = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ar-EG", {
          weekday: "long", // اسم اليوم بالكامل (الأحد، الإثنين...)
          year: "numeric", // السنة
          month: "long", // اسم الشهر بالكامل (فبراير، مارس...)
          day: "numeric", // اليوم
        });
      };
}

export class Essentials{
    public static EnterKeyPressHandling(event: React.KeyboardEvent<HTMLElement> , action:()=>void){
        if(event.key === 'Enter'){
            action();
        }
    }
}
