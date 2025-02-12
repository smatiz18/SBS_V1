import { GetOddsRequest } from "./get-odds-request";

export interface GetEventOddsRequest extends GetOddsRequest {
    eventId: string
}