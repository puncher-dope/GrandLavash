import chalk from "chalk";

type typeMessage = {
    success: 'success'
    warning: 'warning'
    error: 'error'
    info: 'info'
    highlight: 'highlight'
    muted:'muted'
}

const theme = {
    success: chalk.bgGreen,
    warning: chalk.bgYellow,
    error: chalk.bgRed,
    info: chalk.bgBlue,
    highlight: chalk.bgCyan,
    muted: chalk.bgGray
};

export default function log(type: keyof typeMessage, message:string){
    console.log(theme[type](`${message}`))
}
