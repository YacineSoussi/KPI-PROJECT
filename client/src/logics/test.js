import VisitorsRepository from "../repositories/VisitorsRepository";

export default class VisitorsLogic {

    static async getVisitors() {
        return await VisitorsRepository.getVisitors();
    }
    static async getVisitor(id) {
        return await VisitorsRepository.getVisitor(id);
    }
    static async createVisitor(data) {
        return await VisitorsRepository.createVisitor(data);
    }
    static async getVisitorsPerMonth() {
        return await VisitorsRepository.getVisitorsPerMonth();
    }
    
    }
