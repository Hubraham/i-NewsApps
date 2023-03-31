import { Component, Input } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from '../../service/storage.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article!: Article;
  @Input() index!: number;

  constructor( 
    private iab:InAppBrowser,
    private platForm: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService,
    ) { }

  openArticle(){

    if (this.platForm.is('ios') || this.platForm.is('android')) {
      const browser = this.iab.create( this.article.url);
      browser.show()
      return;
    }

    window.open(this.article.url,'_blank');
  }
 
  async onOpenMenu(){

    const articleInFavorite = this.storageService.articleInFavorite(this.article);

    const normalBtn: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Remover Favorito' : 'Favorito',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'danger'
      },
    ]

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()

      
    };

    if ( this.platForm.is('capacitor')){
      normalBtn.unshift(shareBtn)

    }
    
    const actionSheet = await this.actionSheetCtrl.create({
      header:'Opciones',
      buttons: normalBtn

    });

    await actionSheet.present();
  }

  onShareArticle(){

    const {title, source, url} = this.article;
    
    this.socialSharing.share(
      title,
      source.name,
      [],
      url
    );
    
    if (navigator.share) {
      navigator.share({
        title,
        text: this.article.description,
        url
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }else{
      console.log('No se pudo compartir por no soportar el codigo nuevo')
    }

    
  };
  
  onToggleFavorite(){
    
    this.storageService.saveRemoveArticle(this.article);
    
  };
  
  
  compartirNoticia(){

   

  }


}
