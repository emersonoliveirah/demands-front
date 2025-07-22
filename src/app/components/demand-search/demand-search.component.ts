import { Component, OnInit } from '@angular/core';
import { DemandService } from '../../services/demand.service';
import { Demand } from '../../types/demand.type';

@Component({
  selector: 'app-demand-search',
  templateUrl: './demand-search.component.html',
  standalone: true,
  styleUrls: ['./demand-search.component.css']
})
export class DemandSearchComponent implements OnInit {
  demands: Demand[] = [];
  searchTerm: string = '';

  constructor(private demandService: DemandService) {}

  ngOnInit(): void {
    this.fetchDemands();
  }

  fetchDemands(): void {
    this.demandService.getAllDemandsWithToken().subscribe(
      (data) => {
        this.demands = data;
      },
      (error) => {
        console.error('Error fetching demands:', error);
      }
    );
  }

  filterDemands(): Demand[] {
    return this.demands.filter(demand =>
      demand.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      demand.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
