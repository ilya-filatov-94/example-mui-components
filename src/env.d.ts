/// <reference types="@rsbuild/core/types" />

declare module '*.svg?react' {
    import React = require('react');
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}


declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';