import { GAME_VERSIONS } from "utils/enums";
import SoeClient from "../SoeServer/soeclient";
export default abstract class LoginClient extends SoeClient {
    loginSessionId: string | undefined;
    gameVersion: GAME_VERSIONS;
}
