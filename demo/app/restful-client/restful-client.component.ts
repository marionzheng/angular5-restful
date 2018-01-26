import {Component, OnInit} from '@angular/core';
import {RestfulClientService} from "./restful-client.service";

@Component({
    selector: 'demo-restful-client',
    templateUrl: './restful-client.component.html',
    styleUrls: ['./restful-client.component.css']
})
export class RestfulClientComponent implements OnInit {

    constructor(private service: RestfulClientService) {
    }

    ngOnInit() {
    }

    click_get() {
        this.service.get(3)
            .subscribe(
                resp => {
                    console.log(resp);
                }
            );
    }

}
