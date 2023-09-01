import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import chingari from './chingari.json';
export const CHINGARI_APP_PROGRAM_ID=new PublicKey("BWiBHwDqrYP3RutkSqm4ZRBHGSaDFmaKrHmvKvFHgLFr");
export const CHINGARI_IDL = chingari;
export const SOLANA_HOST = clusterApiUrl('devnet');