import { trigger, transition } from '@angular/animations';
import { state } from '@angular/animations';
import { style, animate } from '@angular/animations';

export let slide = trigger('slide',[
    transition(':enter', [
        style({ transform: ' translateX(-10px)'}),
        animate(2000)
    ]),
    transition(':leave',[
        animate(500, style({ transform:'translateX(-100%)' }))
    ])
]);


export let fade = trigger('fade',[
     
    state('void',style({ opacity:0 })),
    transition('void <=> *', [
     
      animate(500)
    ]),
  ])