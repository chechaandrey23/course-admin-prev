import {Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';

import {Observable, Subscriber} from 'rxjs';

import {RatingsService} from './ratings.service';
import {UsersService} from '../users/users.service';
import {ReviewsService} from '../reviews/reviews.service';

@Component({
	selector: 'ratings',
	templateUrl: './ratings.component.html',
	styleUrls: []
})
export class RatingsComponent implements AfterViewInit {
	constructor(
		private ratingsService:RatingsService, 
		private usersService: UsersService,
		private reviewsService: ReviewsService,
	) {
		this.service = this.ratingsService;
	}
	
	@ViewChild('baseTable')
	public baseTable: any;
	
	public querys: any = [
		{namespace: 'gets', method: 'GET', success: (data:any) => this.baseTable.injectData(data)},
		{namespace: 'add', method: 'POST', success: (data:any) => this.baseTable.injectOneData(data), error: (e: any) => this.baseTable.injectErrorAdd(e)},
		{namespace: 'edit', method: 'POST', success: (data:any) => this.baseTable.patchData(data), error: (e: any) => this.baseTable.filterError(e)},
		{namespace: 'remove', method: 'POST', success: (data:any) => this.baseTable.patchData(data), error: (e: any) => this.baseTable.filterError(e)},
		{namespace: 'delete', method: 'POST', success: (data:any) => this.baseTable.filterData(data), error: (e: any) => this.baseTable.filterError(e)},
		
	];
	
	public fields: any = [
		{name: "id", title: "id", width: 5},
		{name: "user", title: "user", width: 25, viewFn: (entry: any) => {
			let datas = [];
			if(entry.user) datas.push(entry.user);
			if(entry.social_id) datas.push(entry.social_id);
			return datas.join('/')
		}, editTitle: 'user', editType: 'select', formControlName: 'userId', editFn: (data: any) => {
			return data.id;
		}, editReceiveFn: () => {
			return new Promise((res, rej) => {
				let obs = this.usersService.source('short-user-gets', 'GET').subscribe((data: any) => {
					obs.unsubscribe();
					res(data.map((entry: any) => { 
						let datas: any = [];
						if(entry.user) datas.push(entry.user);
						if(entry.social_id) datas.push(entry.social_id);
						datas = datas.join('/')
						return {value: entry.id, title: datas}
					}));
				});
				this.usersService.get('short-user-gets');
			})
		}},
		{name: "review", title: "review(title)", width: 25, viewFn: (data: any) => {
			return 'id:'+data.id+'->'+data.groupTitle.group.group+'/'+data.groupTitle.title.title;
		}, editTitle: 'review', editType: 'select', formControlName: 'reviewId', editFn: (data: any) => {
			return data.id;
		}, editReceiveFn: () => {
			return new Promise((res, rej) => {
				let obs = this.reviewsService.source('short-gets', 'GET').subscribe((data: any) => {
					obs.unsubscribe();
					res(data.map((entry: any) => {
						return {value: entry.id, title: 'id:'+entry.id+'->'+entry.groupTitle.group.group+'/'+entry.groupTitle.title.title}
					}));
				});
				this.reviewsService.get('short-gets');
			})
		}},
		{name: "userRating", title: "user rating", width: 20, editTitle: 'rating', editType: 'select', formControlName: 'rating', editReceiveFn: () => {
			return new Promise((res, rej) => {
				res([1,2,3,4,5].map((item) => {return {value: item, title: item}}))
			})
		}}
	];
	
	public service: any;
	
	ngAfterViewInit() {
		this.baseTable.refreshSettings();
	}
	//////////////////////////////////////////////////////
}
