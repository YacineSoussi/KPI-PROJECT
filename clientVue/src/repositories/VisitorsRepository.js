import * as Request from '../services/Request';

export default class VisitorsRepository {
    static async getVisitors() {
        return await Request.make('get', '/visitor');
    }
    static async getVisitor(id) {
        return await Request.make('get', `/visitor/${id}`);
    }
    static async createVisitor(data) {
        return await Request.make('post', '/visitor', data);
    }
    static async getVisitorsPerMonth() {
        return await Request.make('get', '/visitor/month');
    }
    
}
