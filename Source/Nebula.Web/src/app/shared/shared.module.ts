import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './pages';
import { HeaderNavComponent } from './components';
import { UnauthenticatedComponent } from './pages/unauthenticated/unauthenticated.component';
import { SubscriptionInsufficientComponent } from './pages/subscription-insufficient/subscription-insufficient.component';
import { NgProgressModule } from '@ngx-progressbar/core';
import { RouterModule } from '@angular/router';
import { WatershedDetailPopupComponent } from './components/watershed-detail-popup/watershed-detail-popup.component';
import { LinkRendererComponent } from './components/ag-grid/link-renderer/link-renderer.component';
import { FontAwesomeIconLinkRendererComponent } from './components/ag-grid/fontawesome-icon-link-renderer/fontawesome-icon-link-renderer.component';
import { WatershedMapComponent } from './components/watershed-map/watershed-map.component';
import { MultiLinkRendererComponent } from './components/ag-grid/multi-link-renderer/multi-link-renderer.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CustomRichTextComponent } from './components/custom-rich-text/custom-rich-text.component'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FieldDefinitionComponent } from './components/field-definition/field-definition.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AlertDisplayComponent } from './components/alert-display/alert-display.component';
import { FieldDefinitionGridHeaderComponent } from './components/field-definition-grid-header/field-definition-grid-header.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectCustomComponent } from './components/ng-select-custom/ng-select-custom.component';
import { SelectedDataCardComponent } from './components/selected-data-card/selected-data-card.component';
import { StationSelectCardComponent } from './components/station-select-card/station-select-card.component';
import { AutoCompleteModule } from "primeng/autocomplete"

@NgModule({
    declarations: [
        AlertDisplayComponent,
        HeaderNavComponent,
        NotFoundComponent,
        UnauthenticatedComponent,
        SubscriptionInsufficientComponent,
        WatershedMapComponent,
        WatershedDetailPopupComponent,
        LinkRendererComponent,
        FontAwesomeIconLinkRendererComponent,
        MultiLinkRendererComponent,
        CustomRichTextComponent,
        FieldDefinitionComponent,
        FieldDefinitionGridHeaderComponent,
        NgSelectCustomComponent,
        SelectedDataCardComponent,
        StationSelectCardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgProgressModule,
        RouterModule,
        SelectDropDownModule,
        CKEditorModule,
        NgbModule,
        NgSelectModule,
        AutoCompleteModule
    ],
    exports: [
        AlertDisplayComponent,
        CommonModule,
        FormsModule,
        NotFoundComponent,
        WatershedMapComponent,
        HeaderNavComponent,
        CustomRichTextComponent,
        FieldDefinitionComponent,
        FieldDefinitionGridHeaderComponent,
        NgSelectCustomComponent,
        SelectedDataCardComponent,
        StationSelectCardComponent
    ],
    entryComponents:[
        WatershedDetailPopupComponent,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
    return {
        ngModule: SharedModule,
        providers: []
    };
}

    static forChild(): ModuleWithProviders<SharedModule> {
    return {
        ngModule: SharedModule,
        providers: []
    };
}
}
