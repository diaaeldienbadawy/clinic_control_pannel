import { getCountries, getCountryCallingCode } from "libphonenumber-js";

export class GeneralMethods {
    public static generateRandomString(length:number):string {
       const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       let result = '';
       const charactersLength = characters.length;

       for (let i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    public static removeNonNumeric(str:string):string{
      return str.replace(/[^0-9]/g,'');
    }
    public static removeNonFloatNumeric(str:string):string{
      return str.replace(/[^0-9.+-]/g, '');
    }
    public static removeNonPositiveFloatNumeric(str:string):string{
      return str.replace(/[^0-9.]/g, '');
    }
    public static removeNonAlphanumeric(str:string):string {
        return str.replace(/[^a-zA-Z0-9]/g, '');
      }
    public static removeNonAlphanumericCapital(str:string):string {
      return str.replace(/[^A-Z0-9]/g, '');
    }
    public static removeNonArabic(str: string): string {
      return str.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s.,!?;:'"-]+/g, '');
    }
    public static removeNonEnglish(str: string): string {
      return str.replace(/[^a-zA-Z\s.,!?;:'"-]+/g, '');
    }
    public static getCountryFromDialCode(dialCode:string) {
      if(dialCode.length ==1)dialCode = dialCode+'0'
      const countries = getCountries();
      dialCode = '+'+dialCode;
      for (let country of countries) {
        if (`+${getCountryCallingCode(country)}` === dialCode) {
          return country.toLowerCase();
        }
      }
      return null;
    }

    public static convertToLocalDateTime(dateTime?:string){
      if(dateTime){
        const utcDateTime = dateTime;
        
        // تحويل التوقيت المستلم إلى كائن Date (سيكون بالتوقيت العالمي)
        const receivedDateUTC = new Date(utcDateTime);
        
        // تحويل التوقيت المستلم إلى التوقيت المحلي
        const receivedDateLocal = new Date(
          receivedDateUTC.getTime() - receivedDateUTC.getTimezoneOffset() * 60000
        );
      
        return receivedDateLocal;
      }else return undefined
    }

    public static formatDateForInput (date: Date): string  {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-based
      const day = date.getDate().toString().padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };

    public static deActivateForm(id:string){
      document.getElementById(id)?.addEventListener('submit', function(event) {
        event.preventDefault(); 
      });
    }

    public static isValidEmail(email: string): boolean  {
      const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };
    public static isValidFloatNumber(input: string): boolean  {
      const floatRegex = /^[+-]?([0-9]*[.])?[0-9]+$/;
      return floatRegex.test(input);
    };
    public static isValidArabicString(inp:string){
      const floatRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/;
      return floatRegex.test(inp);
    }

    public static formatTime(time: string): string {
      const date = new Date(`1970-01-01T${time}:00`);
      const formatter = new Intl.DateTimeFormat('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return formatter.format(date);
    }

    public static extractIdFromUrl():string|null{
      const regex = /\/\d+$/;
      let currentUrl = window.location.href;
      
      const match = currentUrl.match(regex);
      return match ? match[0].substring(1) : null;
    }

    public static removeParamsFromUrl (){
        const regex = /\/\d+$/;
        let currentUrl = window.location.href;
        if (regex.test(currentUrl)) {
          window.history.pushState({}, '', currentUrl.replace(regex, ''));
        }
    }

    public static mobileNumberInput(v:string){
      v = v.replace(/[^0-9]/g, "")
      if(v.length==1 && v[0]!='0')v=''
      else if(v.length==2 && v[1]!='1')v=v[0]
      return v
    }
}

