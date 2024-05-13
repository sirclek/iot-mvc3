const { body, validationResult } = require("express-validator");
const Shipment = require("../models/shipment"); // Assuming you have a Shipment model
const asyncHandler = require("express-async-handler");

class ShipmentController {
    constructor(shipment_history) {
        this.shipment_history = shipment_history;
    }

    create_get(req, res, next) {
        res.render("shipment/create", { title: "Create Shipment" });
    }

    create_post(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const prev = {
                order_id: req.body.order_id,
                method: req.body.method,
                date: req.body.date,
                address: req.body.address,
            };
            return res.render("shipment/create", { title: "Create Shipment", prev: prev, errors: errors.array() });
        }

        const { order_id, method, date, address } = req.body;
        this.createShipment(order_id, method, date, address);
        res.redirect("/");
    }

    async createShipment(order_id, method, date, address) {
        const shipment_id = generateUniqueId(); // Assuming you have a function to generate unique IDs
        const shipment = new Shipment({ shipment_id, order_id, method, date, address });
        await shipment.save();
        this.shipment_history.addShipment(shipment);
    }

    async update_get(req, res, next) {
        try {
            const shipment = await Shipment.findById(req.params.id);
            res.render("shipment/update", { title: "Update Shipment", shipment: shipment });
        } catch (error) {
            console.error("Error fetching shipment:", error);
            res.redirect("/");
        }
    }

    async update_post(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const prev = {
                order_id: req.body.order_id,
                method: req.body.method,
                date: req.body.date,
                address: req.body.address,
            };
            return res.render("shipment/update", { title: "Update Shipment", shipment: prev, errors: errors.array() });
        }

        const { order_id, method, date, address } = req.body;
        await Shipment.findByIdAndUpdate(req.params.id, { order_id, method, date, address });
        this.shipment_history.updateShipment(req.params.id, { order_id, method, date, address });
        res.redirect("/");
    }

    async deleteShipment(req, res, next) {
        try {
            await Shipment.findByIdAndDelete(req.params.id);
            this.shipment_history.deleteShipment(req.params.id);
            res.redirect("/");
        } catch (error) {
            console.error("Error deleting shipment:", error);
            res.redirect("/");
        }
    }

    async view_get(req, res, next) {
        try {
            const shipments = await Shipment.find();
            res.render("shipment/view", { title: "All Shipments", shipments: shipments });
        } catch (error) {
            console.error("Error fetching shipments:", error);
            res.redirect("/");
        }
    }

    async view_detail_get(req, res, next) {
        try {
            const shipment = await Shipment.findById(req.params.id);
            res.render("shipment/view_detail", { title: "View Shipment", shipment: shipment });
        } catch (error) {
            console.error("Error fetching shipment:", error);
            res.redirect("/");
        }
    }
}

module.exports = ShipmentController;
