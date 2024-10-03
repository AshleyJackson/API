import { config } from 'dotenv'
import { hostname, userInfo } from 'os';
// import * as fs from 'fs'

config()

export const username = userInfo().username.toLowerCase()
export const stage = process.env.STAGE || username + '-live'
export const hsn = hostname();
