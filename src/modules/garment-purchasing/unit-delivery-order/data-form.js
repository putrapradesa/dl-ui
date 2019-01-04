import { inject, bindable, containerless, computedFrom, BindingEngine } from 'aurelia-framework'
import { Service } from "./service";
var StorageLoader = require('../../../loader/storage-loader');
var UnitLoader = require('../../../loader/garment-units-loader');
var UnitReceiptNoteLoader = require('../../../loader/garment-unit-receipt-note-basic-loader');
import moment from 'moment';

@containerless()
@inject(Service, BindingEngine)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable error = {};
    @bindable title;
    @bindable options = { };
    @bindable kurs = {};
    @bindable unitRequest;
    @bindable RONo

    typeUnitDeliveryOrderOptions = ['PROSES', 'TRANSFER', 'RETUR', 'SAMPLE'];
    controlOptions = {
        label: {
            align : "left",
            length: 4
        },
        control: {
            length: 5,
            align: "right"
        }
    }
    RONoOptions = {
        label: {
            align : "left",
            length: 4
        },
        control: {
            length: 8,
            align: "left"
        }
    }

    constructor(service, bindingEngine) {
        this.service = service;
        this.bindingEngine = bindingEngine;
    }

    async bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        this.isItem = false;
        if (this.data.UnitDOType) {
            if (this.data.UnitDOType === "PROSES") {
                this.isProses = true;
            }
            else {
                this.isProses= false;
            }
        }
        else {
            this.isProses = true;
        }
        
        if(this.data.Items)
            if (this.data.Items.length > 0) {
                this.isItem = true;
            }

        this.options.readOnly = this.readOnly;
        
        this.readOnlySender = true;
        
    }

    @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

    @computedFrom("data.UnitSender")
    get filterUnit() {
        var storageFilter = {}
        if (this.data.UnitSender) {
            storageFilter.UnitName = this.data.UnitSender.Name;
        }

        return storageFilter;
    }

    @computedFrom("data.UnitSender")
    get filterUnits() {
        var rONoFilter = {}
        if (this.data.UnitSender) {
            rONoFilter.UnitId = this.data.UnitSender.Id;
        }
        return rONoFilter;
    }

    unitDOTypeChanged(e) {
        var selectedCategory = e.srcElement.value;
        if (selectedCategory) {
            this.data.UnitDOType = selectedCategory;

            this.data.RONo = '';
            this.data.ProductName = '';
            this.data.ProductCode = '';
            this.data.ProductRemark = '';
            this.data.Quantity = '';
            this.data.UomUnit = '';
            if(this.data.UnitDOType === "PROSES" || this.data.UnitDOType === "RETUR" || this.data.UnitDOType === "SAMPLE"){
                this.readOnlySender = true;
            }
            else{
                this.data.UnitSender = null;
                this.readOnlySender = this.options.readOnly;
            }
            if (this.data.UnitDOType === "PROSES") {
                this.isProses = true;
            }
            else {
                this.isProses = false;
            }
            this.data.Items = [];
        }
        this.data.UnitRequest = null;
        this.data.UnitSender = null;
        this.Storage = null;
    }

    get storageLoader() {
        return StorageLoader;
    }

    storageView = (storage) => {
        var code=storage.code? storage.code : storage.Code;
        var name=storage.name? storage.name : storage.Name;
        return `${code} - ${name}`
    }

    unitChanged(newValue){
        var selectedUnit = newValue;
        if(selectedUnit){
            this.data.UnitRequest = selectedUnit;
            this.data.UnitSender = selectedUnit;
        }
        else if(this.data.UnitDOType === "TRANSFER"){
            this.data.UnitSender = null;
            this.data.UnitRequest = null;
        }
        else{
            this.data.UnitRequest = null;
            this.data.UnitSender = null;
        }
    }

    RONoChanged(newValue){
        var selectedro = newValue;
        if(newValue == null){
            this.data.Items = null;
            this.error = null;
        }
        else if(newValue){
            this.data.RONo = selectedro.RONo;
            this.data.Items = [];
            for(var item of selectedro.Items){
                var Items = {};
                Items.Article = item.Article;
                Items.ProductId = item.ProductId;
                Items.ProductCode = item.ProductCode;
                Items.ProductName = item.ProductName;
                Items.ProductRemark = item.ProductRemark;
                Items.RONOItem = item.RONo;
                Items.UomId =  item.UomId;
                Items.UomUnit = item.UomUnit;
                Items.Quantity = (item.ReceiptQuantity - item.OrderQuantity);

                this.data.Items.push(Items);
            }
        }
        else{
            this.data = null;
        }
    }

    get unitLoader() {
        return UnitLoader;
    }

    roNoView = (rono) => {
        // console.log(rono);
        return `${rono.RONo} - ${rono.Items.Product.Name} - ${rono.Items.Product.Code}`
    }

    unitRequestView = (unitRequest) => {
        return `${unitRequest.Code} - ${unitRequest.Name}`
    }

    unitSenderView = (unitSender) => {
        return `${unitSender.Code} - ${unitSender.Name}`
    }

    get unitReceiptNoteLoader() {
        return UnitReceiptNoteLoader;
    }

    unitReceiptNoteView = (unitReceiptNote) => {
        var coba = unit[0].RONo;
        return `${coba}`;
    }

    async search() {

        var items=[];
        var index=0;
        for(var data of result.data){
            for(var item of data.Items){
                if(pr.length==0){

                    items.push({
                        index:index++,
                        PONo: data.PONo,
                        POId: data.Id,
                        PRNo: data.PRNo,
                        PRId: data.PRId,
                        PO_SerialNumber: item.PO_SerialNumber,
                        RONo: data.RONo,
                        Article: data.Article,
                        Product: item.Product,
                        DefaultQuantity: parseFloat(item.Quantity).toFixed(2),
                        DefaultUom: item.Uom,
                        DealQuantity: Number(item.Quantity),
                        DealUom: item.Uom,
                        BudgetPrice: Number(item.BudgetPrice),
                        PriceBeforeTax: Number(item.BudgetPrice),
                        PricePerDealUnit: Number(item.BudgetPrice),
                        budgetUsed: item.BudgetPrice*item.Quantity,
                        remainingBudget:item.RemainingBudget,
                        IsOverBudget: false,
                        totalBudget: item.BudgetPrice*item.Quantity,
                        RemainingBudget:item.RemainingBudget,
                        Conversion: 1,
                        Remark: item.ProductRemark,
                        Initial:item.RemainingBudget
                    });

                    pr[item.PRNo+item.PO_SerialNumber+item.Product.Id]=item.RemainingBudget-item.budgetUsed;
                }
                else{
                    var dup=items.find(a=>a.PRNo==item.PRNo && item.Product.Id==a.Product.Id && a.PO_SerialNumber==item.PO_SerialNumber);
                    if(dup){
                        item.RemainingBudget=pr[item.PRNo+item.PO_SerialNumber+item.Product.Id];
                        pr[item.PRNo+item.PO_SerialNumber+item.Product.Id]=item.RemainingBudget-(item.BudgetPrice*item.Quantity);
                    }
                    else{
                        pr[item.PRNo+item.PO_SerialNumber+item.Product.Id]=item.RemainingBudget-(item.BudgetPrice*item.Quantity);
                        //item.RemainingBudget=pr[item.PRNo];
                    }

                    items.push({
                        PONo: data.PONo,
                        POId: data.Id,
                        PRNo: data.PRNo,
                        PRId: data.PRId,
                        PO_SerialNumber: item.PO_SerialNumber,
                        RONo: data.RONo,
                        Article: data.Article,
                        Product: item.Product,
                        DefaultQuantity: parseFloat(item.Quantity).toFixed(2),
                        DefaultUom: item.Uom,
                        DealQuantity: Number(item.Quantity),
                        DealUom: item.Uom,
                        BudgetPrice: Number(item.BudgetPrice),
                        PriceBeforeTax: Number(item.BudgetPrice),
                        PricePerDealUnit: Number(item.BudgetPrice),
                        budgetUsed: item.BudgetPrice*item.Quantity,
                        remainingBudget:item.RemainingBudget,
                        IsOverBudget: false,
                        totalBudget: item.BudgetPrice*item.Quantity,
                        Conversion: 1,
                        Remark: item.ProductRemark,
                        Initial:item.RemainingBudget
                    });
                }

            }

        }
        items = [].concat.apply([], items);
        this.data.Items=items;
        this.isItem = true;
    }



    items = {
        columns: [
            "Kode Barang",
            "Nama Barang",
            "Keterangan Barang",
            "RO Asal",
            "Jumlah",
            "Satuan",
            "Tipe Fabric"],
    };
}