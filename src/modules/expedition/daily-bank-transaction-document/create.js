import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { activationStrategy } from 'aurelia-router';

@inject(Router, Service)
export class Create {
    hasCancel = true;
    hasSave = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }
    activate(params) {
    }

    bind(params) {
        this.data = {};
        this.error = {};
    }

    cancel(event) {
        this.data = {};
        this.router.navigateToRoute('list');
    }

    // determineActivationStrategy() {
    //     return activationStrategy.replace; //replace the viewmodel with a new instance
    //     // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
    //     // or activationStrategy.noChange to explicitly use the default behavior
    // }

    save(event) {
        this.service.create(this.data)
            .then(result => {
                alert("Data berhasil dibuat");
                let bank = this.data.Bank;
                this.data = Object.assign({}, {});
                this.data.Bank = bank;
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(error => {
                this.error = error;
            });
    }
}