import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../service/news.service';
import { Article } from '../../interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  @ViewChild( IonInfiniteScroll, {static: true} ) infinitScroll! : IonInfiniteScroll;

  public articles: Article[] = [];


  constructor( private newService : NewsService) {}
  
  ngOnInit() {
   this.newService.getTopHeadLines()
   .subscribe( articles => this.articles.push(...articles));
   
  }

  loadData(){
    this.newService.getTopHeadLinesByCategory('business', true)
    .subscribe( articles => {
      
      if (articles.length === this.articles.length) {
        
        this.infinitScroll.disabled = true;
       
        return;
      }
      
      
      this.articles = articles;
      this.infinitScroll.complete();
    })
  }

}
