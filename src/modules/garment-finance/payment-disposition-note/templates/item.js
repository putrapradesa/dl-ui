
export class Item {

    constructor() {
        
        this.columns = ['Unit', 'Nama Barang', 'Jumlah', 'Satuan', 'Harga Total'];
    }

    activate(context) {
        this.data = context.data
        this.isShowing = false;
        // this.data.Details= this.data.items;
        // console.log("items",this);
        // if(context.context.options){
        //     this.IDR= context.context.options.IDR;
        //     this.rate= context.context.options.rate;
        //     this.sameCurrency= context.context.options.SameCurrency;
        //     if(this.IDR){
        //         this.data.payToSupplierIDR=this.data.payToSupplier * this.rate;
        //         this.data.currencyIDR="IDR";
        //     }
        // }
        // this.data.DiffTotalPaidPayment = this.data.TotalPaid-(this.data.TotalPaidPayment+this.data.TotalPaidPaymentBefore)     
        // console.log("activae item ", this)   ;
        // this.data.DiffTotalPaidPayment = parseInt(this.data.TotalPaid,10) - (parseInt(this.data.TotalPaidPayment,10)+parseInt(this.data.TotalPaidPaymentBefore,10));
        // this.data.DiffTotalPaidPayment = parseFloat(this.data.TotalPaid)-(parseFloat(this.data.TotalPaidPayment)+parseFloat(this.data.TotalPaidPaymentBefore));
        
        
    }

    toggle() {
        this.isShowing = !this.isShowing;
    }

    onRemove() {
        this.bind();
    }

    TotalPaidPaymentChanged(e){
        // console.log("Total Paid Changed",e);
        this.data.DiffTotalPaidPayment = parseFloat(this.data.TotalPaid)-(parseFloat(e.srcElement.value)+parseFloat(this.data.TotalPaidPaymentBefore));
    }

}
