export class SuccessfulLoginServerResponse{
    public constructor(
        public token?:string,       
        public userType?:string,
        public email?:string,
        public userID?:number
    ){}

}