import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, CoreService } from './service';
import { Dialog } from "../../../au-components/dialog/dialog";
import { RejectDialog } from "./template/dialog/reject";

@inject(Router, Service, CoreService, Dialog)
export class View {

    constructor(router, service, coreService, dialog) {
        this.router = router;
        this.service = service;
        this.coreService = coreService;
        this.dialog = dialog;
    }

    formOptions = {
        cancelText: "Back",
        editText: "Approve",
        deleteText: "Cancel",
        saveText: "Reject",
    }

    async activate(params) {
        var id = params.id;
        this.data = await this.service.getById(id);
        var idx = 0;
        if (this.data.measurements) {
            for (var i of this.data.measurements) {
                i.MeasurementIndex = idx;
                idx++;
            }
        }

        if (this.data.section) {
            this.selectedSection = await this.coreService.getSectionById(this.data.section.id);
        }
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    editCallback(event) {
        this.router.navigateToRoute('approve', { id: this.data.id });
    }

    deleteCallback(event) {
        if (confirm("Cancel?")) {
            this.service.cancel(this.data).then(result => {
                this.cancelCallback();
            });
        }
    }

    saveCallback(event) {
        this.dialog.show(RejectDialog, {})
            .then(response => {
                if (!response.wasCancelled) {
                    this.service.reject({ id: this.data.id, reason: response.output })
                        .then(result => {
                            alert('Packing List berhasil diReject');
                            this.cancelCallback();
                        })
                        .catch(error => {
                            if (typeof error === 'string') {
                                alert(`Reject dibatalkan : ${error}`);
                            } else {
                                alert(`Error : ${error.message}`);
                            }
                        });
                }
            });
    }
}