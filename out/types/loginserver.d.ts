export interface GameServer {
    serverId: number;
    serverState: number;
    locked: boolean;
    name: string;
    nameId: number;
    description: string;
    descriptionId: number;
    reqFeatureId: number;
    serverInfo: string;
    populationLevel: number;
    populationData: string;
    allowedAccess: boolean;
}
