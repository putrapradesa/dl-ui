import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import moment from "moment"; 

@inject(Router, Service)
export class Create {

    constructor(router, service) {
        this.router = router;
        this.service = service;
        
        this.flag = false;

    }
    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: 4,
        },
    };
    tableOptions = {
        search: false,
        showToggle: false,
        showColumns: false
    }

    //context = ["detail"];
    fromList = ["","PRODUKSI", "RETUR PACKING", "RETUR FINISHING", "RETUR PRINTING", "RECHEKING", "LAIN-LAIN"];
    columns = [
    {
      field: "Date",
      title: "Tanggal",
      sortable:  false,
      formatter: function (value, data, index) {
        return moment(value).format("DD MMM YYYY");
      },
    },
    { field: "BonNo", title: "No. Bon", sortable: false },
    { field: "Construction", title: "Konstruksi", sortable: false},
    { field: "Grade", title: "Grd", sortable: false},
    { field: "Piece", title: "Piece", sortable: false},
    { field: "Quantity", title: "Jml. Meter", sortable: false},
    { field: "QuantityPiece", title: "Jml. Piece", sortable: false}
  ];


  dateFromChanged(e) {
    var _startDate = new Date(e.srcElement.value);
    var _endDate = new Date(this.dateTo);


    if (_startDate > _endDate)
        this.dateTo = e.srcElement.value;

} 

search() {
    this.error = {};

    if (Object.getOwnPropertyNames(this.error).length === 0) {
        this.flag = true;
        this.Table.refresh();
    }
}


reset(){
    this.fromList = undefined;
    this.dateFrom = undefined;
    this.dateTo = undefined;

    this.error = {};
    this.flag = false;
}

  loader = (info) => {
    var order = {};

    if (info.sort)
        order[info.sort] = info.order;
    

    let args = {
        page: parseInt(info.offset / info.limit, 10) + 1,
        size: info.limit,
        fromList: this.from,
        dateTo: this.dateTo? moment(this.dateTo).format("MM/DD/YYYY"):"",
        dateFrom: this.dateFrom? moment(this.dateFrom).format("MM/DD/YYYY"):"",
        
    };
    console.log(this.fromList);
    console.log(args);
    return this.flag ?
        (
            this.service.search1(args)
                .then(result => {
                    var index=0;
                    for(var data of result.Data){
                        index++;
                        data.index=index;
                       
                    }
                    return {
                        total: result.Count,
                        data: result.Data
                    };
                })
        ) : { total: 0, data: [] };
    } 



    list() {
        this.router.navigateToRoute('list');
    }

}