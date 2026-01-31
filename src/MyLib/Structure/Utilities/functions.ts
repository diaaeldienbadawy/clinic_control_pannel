
export class Scroling{
    public static scrollToTop(isSmooth:ScrollBehavior | undefined = 'smooth') {
        document.getElementById('nav-bar')?.scrollIntoView({
            behavior:isSmooth
        });
    }
}
