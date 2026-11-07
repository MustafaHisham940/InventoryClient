import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';

/**
 * Common frame of the report screens: gradient title bar, filter area (projected content),
 * search button, and the PDF preview with the Excel download.
 *
 * Styles are global on purpose (ViewEncapsulation.None, every class prefixed `rpt-`) so the
 * filter fields written in each report's own template - and <app-store-scope-field> - share them.
 */
@Component({
  selector: 'app-report-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-shell.component.html',
  styleUrl: './report-shell.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ReportShellComponent {

  @Input() title = '';
  /** FontAwesome class of the title icon */
  @Input() icon = 'fa-chart-bar';
  @Input() submitLabel = 'بحث';
  /** the search button is disabled while the form is invalid */
  @Input() canSubmit = true;
  @Input() loading = false;
  @Input() pdfUrl?: SafeResourceUrl;
  @Input() showExcel = false;

  @Output() search = new EventEmitter<void>();
  @Output() excel = new EventEmitter<void>();
}
