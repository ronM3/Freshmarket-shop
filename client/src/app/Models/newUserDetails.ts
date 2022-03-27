export class NewUserDetails{
    public constructor(
        public id?:number,
        public email?:string,
        public password?: string,
        public city?:string,
        public street?:string,
        public firstName?: string,
        public lastName?:string
    ){}
}