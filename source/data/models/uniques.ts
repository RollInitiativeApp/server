import Hashids from "hashids";

let generator = new Hashids(process.env.UNIQUES_SALT, 8, "abcdefghijklmnopqrstuvwxyz");

export default generator;
