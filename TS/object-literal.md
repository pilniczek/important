[playground](https://www.typescriptlang.org/play?#code/PQKgBAIgogYgggVQDIBUDKYTAFABcCeADgKZgoDy5A+mgApQDCAkjEw1VQMYD2AdrgCcAhp1woixFNxQBLXABtJEsAF4wAb2xhtYBDABcYAM6CZvAOYBuLToZJDJgWas3ttA8dMXrAXzzKefmFRcRIpWQUlElUNMABtAGtifAcvcwBdVKdvMB8wAB9PbPN-aKT8GMdnbEVcY2JFUX1y7GxQMHIAIQApRhQwOFpaACVyOAYACUwcbECTMEDBETEJcLlFcgAjACt9ReCVsOl1qNI1TR1dDwAiWmJeAC8ZbYTua4AaVzA7Q2vAX0AZAA3bi4V4fL7uX53R7PMGfPLtfKFa68EFgABm3AArrwACbXSzTMDtXHcYhGMCouoAd24AgS01aRgaxFEMWudmusz4Rm4igAdPJuOYABTXLq9Bj9QYjMaTX7vBZ8JYhVbHSJbbZxZmNXDpACUTJZbLU1wAGgwuXM+cRBcKxRK+gMhqNxhMFUqgstQpJ1RsdtrjXrDdgday6qbrsTgGA6UVnDJ0TJiLiwDjccQk7wU9zeLyBULReKek6Za75WAPp6VYdfRF-Vqw6IDa12jAEAA5KVMcgduBIZ2yt2M3PzfbetX14gwHGcGIipu4fRVCz65dpVQAPg0XwExFwWIEvB3l0ueih9yeLzen1PtnslYBwNBN6+l0hlehV7hXx8gd16QFMiVIYtieJcj41ihkG7KcqONp2kW7ZdigPZ9gOZZyu6laKuOqpHFOM68JwC5BvqIaLuyFpWjyCGFmKyHdr2-aDuW2FVnhtZrJEREkYu5FGrq7JRsAMZxiu5iJsmqbppmZg5taBb2tcjGocxGEulhHqcT63GKLxpG6gJbTgKpaEsZhw4AOpMCgUzDFAtDkMMqEdgA4iOcx1HuhB0hGYAivqW6evmtr0dcPl+c4YDEIC9y4Nc+pQV51YHLpfrTrOwzEL5Aj+YZ4brsUa4ScFFw6Cl3A7HsyppZOJw+jE5V3uen6XrCr53toPyPkCII-l1YAfrc7XXuClx+JciYigAhAVbJmLGOzkSeXWRXlgVvjoe4HkelYgZi6ZchNu77oex5VY2QaAZc2CQYJ4awUgNF5nRylmeprFYWANl2WADlOS5TDudptUTgRJy8dluW4PNuDGZRprUfBSlIZ2THoV91m2fZjnOa5bmg16+F1pDWU5X5cMIzBkbRrGAjxhYUkpmmeJydmuIo2F73o2pmOWZMP04-9eNAyDOGpeDpM8eTMNU-qQA)

/* DEFAULTS */
type TOO_SPECIFIC__contractTypeToTitleType = {
    UF: string;
    CL: string;
    PF: string;
}
type contractTypeToTitleType = { [key: string]: string; } | string
type key = string
let select:key

/* OBJECT APPROACH */

const contractTypeToTitleObj:contractTypeToTitleType = {
    UF: "Penzijko",
    CL: "Životko",
    PF: "Penzijko",
} /* || "not found"; */ /* does not work */

select = "CL"
console.log("OBJECT APPROACH: ", contractTypeToTitleObj[select])

select = "XC"
console.log("OBJECT APPROACH: ", contractTypeToTitleObj[select])

select = "" // or stringified undefined
console.log("OBJECT APPROACH: ", contractTypeToTitleObj[select])

/* FUNCTIONAL APPROACH */

const contractTypeToTitleFunc = (select:string):string => {
    return {
        UF: "Penzijko",
        CL: "Životko",
        PF: "Penzijko",
    }[select] || "not found"
};

select = "CL"
console.log("FUNCTIONAL APPROACH: ", contractTypeToTitleFunc(select))

select = "XC"
console.log("FUNCTIONAL APPROACH: ", contractTypeToTitleFunc(select))

select = "" // or stringified undefined
console.log("FUNCTIONAL APPROACH: ", contractTypeToTitleFunc(select))

/* FUNCTIONAL APPROACH WITH REPORTING */

const report = () => console.log("reporting event");

const contractTypeToTitleFuncReport = (select:string):string => {
    const obj:contractTypeToTitleType = {
        UF: "Penzijko",
        CL: "Životko",
        PF: "Penzijko",
    }
    if(!(select in obj)) {
        report()
        return "not found"
    }
    return obj[select]     
};

select = "CL"
console.log("FUNCTIONAL APPROACH WITH REPORTING: ", contractTypeToTitleFuncReport(select))

select = "XC"
console.log("FUNCTIONAL APPROACH WITH REPORTING: ", contractTypeToTitleFuncReport(select))

select = "" // or stringified undefined
console.log("FUNCTIONAL APPROACH WITH REPORTING: ", contractTypeToTitleFuncReport(select))
