import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {


  context = ["detail"]

  columns = [
    { field: "code", title: "Kode" },
    { field: "name", title: "Nama" },
    { field: "uomUnit", title: "Satuan" },
    { field: "categoryName", title: "Kategori" },
  ];

  loader = (info) => {
    var order = {};
    if (info.sort)
      order[info.sort] = info.order;
    var arg = {
      page: parseInt(info.offset / info.limit, 10) + 1,
      size: info.limit,
      keyword: info.search,
      order: order,
    }

    return this.service.search(arg)
      .then(result => {
        var data = {}
        data.total = result.total;
        data.data = result.data;

        return data;
      });
    // return {
    //   data: [],
    //   total: 0
    // }
  }

  constructor(router, service) {
    this.service = service;
    this.router = router;

  }

  contextClickCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "detail":
        this.router.navigateToRoute('view', { id: data.id });
        break;
    }
  }

  create() {
    this.router.navigateToRoute('create');
  }
}

