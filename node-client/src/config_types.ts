import * as fs from 'fs';
import * as u from 'underscore';

export interface Cluster {
    readonly name: string;
    readonly caData: string;
    readonly caFile: string;
    readonly server: string;
    readonly skipTLSVerify: boolean;
}

export function newClusters(a: any): Cluster[] {
    return u.map(a, clusterIterator());
}

function clusterIterator(): u.ListIterator<any, Cluster> {
    return (elt: any, i: number, list: u.List<any>): Cluster => {
        if (!elt.name) {
            throw new Error(`clusters${i}.name is missing`);
        }
        if (!elt.cluster.server) {
            throw new Error(`clusters[${i}].cluster.server is missing`);
        }
        return {
            caData: elt.cluster['certificate-authority-data'],
            caFile: elt.cluster['certificate-authority'],
            name: elt.name,
            server: elt.cluster.server,
            skipTLSVerify: elt.cluster['insecure-skip-tls-verify'] === true,
        };
    };
}

export interface User {
    readonly name: string;
    readonly certData: string;
    readonly certFile: string;
    readonly keyData: string;
    readonly keyFile: string;
    readonly authProvider: any;
    readonly token: string;
    readonly username: string;
    readonly password: string;
}

export function newUsers(a: any): User[] {
    return u.map(a, userIterator());
}

function userIterator(): u.ListIterator<any, User> {
    return (elt: any, i: number, list: u.List<any>): User => {
        if (!elt.name) {
            throw new Error(`users[${i}].name is missing`);
        }
        let token = null;
        if (elt.user.token) {
            token = elt.user.token;
        }
        if (elt.user['token-file']) {
            token = fs.readFileSync(elt.user['token-file']);
        }
        return {
            authProvider: elt.user['auth-provider'],
            certData: elt.user['client-certificate-data'],
            certFile: elt.user['client-certificate'],
            keyData: elt.user['client-key-data'],
            keyFile: elt.user['client-key'],
            name: elt.name,
            password: elt.user.password,
            token,
            username: elt.user.username,
        };
    };
}

export interface Context {
    readonly cluster: string;
    readonly user: string;
    readonly name: string;
}

export function newContexts(a: any): Context[] {
    return u.map(a, contextIterator());
}

function contextIterator(): u.ListIterator<any, Context> {
    return (elt: any, i: number, list: u.List<any>): Context => {
        if (!elt.name) {
            throw new Error(`contexts[${i}].name is missing`);
        }
        if (!elt.context.cluster) {
            throw new Error(`contexts[${i}].context.cluster is missing`);
        }
        if (!elt.context.user) {
            throw new Error(`context[${i}].context.user is missing`);
        }
        return {
            cluster: elt.context.cluster,
            name: elt.name,
            user: elt.context.user,
        };
    };
}
