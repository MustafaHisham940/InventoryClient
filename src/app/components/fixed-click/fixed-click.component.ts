import { NgClass } from '@angular/common'
import {
	Component,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	Output,
} from '@angular/core'


@Component({
  selector: 'app-fixed-click',
  standalone: true,
  imports: [NgClass],
  templateUrl: './fixed-click.component.html',
  styleUrl: './fixed-click.component.css'
})
export class FixedClickComponent implements OnInit {
	@Input() buttonTitle!: string
	@Output() clickEvent: EventEmitter<void> = new EventEmitter()
	isScrolling: boolean = false
	lastScrollPosition: number = 0
	isScrollingTop: boolean = false
	constructor() {}

	ngOnInit(): void {}

	@HostListener('window:scroll', ['$event'])
	onWindowScroll($event: any) {
		if (window.scrollY > this.lastScrollPosition) {
			this.isScrollingTop = false
		} else {
			this.isScrollingTop = true
		}
		this.lastScrollPosition = window.scrollY
		this.isScrolling = true
	}
}
