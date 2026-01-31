import { profileCertificate } from "./profileCertificate"
import { profileExperience } from "./profileExperience"
import { profileResearch } from "./profileResearch"

export interface profile{
    id?:string
    name:string
    profile_img:string|File
    specialization?:string
    job_title?:string
    university?:string
    mobile?:string
    whatsapp?:string
    email?:string
    summery?:string
    profile_certificates?:profileCertificate[]
    profile_experiences?:profileExperience[]
    profile_researchs?:profileResearch[]
}