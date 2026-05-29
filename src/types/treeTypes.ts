
export type ITreeNode = {
    id: string | number;
    parent: null | string | number;
    level: number;
    isExpanded: boolean;
    childs: Array<string | number>;
}

export type IintPointTreeNode = {
    integrationPointName?: string;
    earepoCode?: string;
}