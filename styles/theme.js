import styled from "styled-components";

const pixelToRem = size => `${size / 16}rem`;

const fontSizes = {
    title:pixelToRem(60),
    subtitle:pixelToRem(30),
    paragraph:pixelToRem(18),
}

const colors = {
    yellow:"#EDE51E",
    pointColor1:'#fabd86',
    pointColor2:'#5f6f9a',
    pointColor3:'#b44c34',
    pointColor4: '#c17065',
    signatureRed: '#F23645',
    signatureBlue: '#2f48ba',
    signatureGreen: '#2cde47',
    signatureMint: '#089981',
}

export const dark = {
    fontSizes,
    colors : {
        ...colors,
        titleColor:'#B0C7EA',
        textColor:'#B0C7EA',
        bgColor:'#242424',
        invertColor:'#f2f3ffee',
        textMild:'#fff',
        blockColor:"#353535",

    }
}
export const light = {
    fontSizes,
    colors : {
        ...colors,
        titleColor: "#0B2068",
        textColor: "#0B2068",
        bgColor:'#efefef',
        invertColor:'#cacaca',
        textMild:'#000',
        blockColor:"#fffcff",
    }
}