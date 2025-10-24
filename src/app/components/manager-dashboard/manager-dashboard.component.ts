import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Demand } from '../../types/demand.type';
import { UserDto } from '../../types/user-dto.type'; // Certifique-se de ter este tipo

// Interface para representar um subordinado com estado de carregamento e demandas
interface SubordinateWithState extends UserDto {
  demands?: Demand[]; // Demandas carregadas
  loadingDemands: boolean; // Estado de carregamento das demandas
  errorLoadingDemands: string | null; // Erro ao carregar demandas
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
})
export class ManagerDashboardComponent implements OnInit {
  subordinatesWithState: SubordinateWithState[] = []; // Dados principais para exibição
  loadingSubordinates: boolean = false; // Flag para indicar carregamento dos subordinados
  errorLoadingSubordinates: string | null = null; // Armazenar mensagens de erro no carregamento de subordinados

  managerId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.managerId = sessionStorage.getItem('user-id') || '';
    if (this.managerId) {
      this.loadSubordinates();
    } else {
      this.errorLoadingSubordinates = 'ID do manager não encontrado na sessão.';
      console.error(this.errorLoadingSubordinates);
    }
  }

  private getAuthHeaders() {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // Carrega a lista inicial de subordinados (sem demandas)
  loadSubordinates(): void {
    this.loadingSubordinates = true;
    this.errorLoadingSubordinates = null;
    const token = sessionStorage.getItem('auth-token');

    if (!this.managerId || !token) {
      this.errorLoadingSubordinates = 'Dados de autenticação insuficientes.';
      this.loadingSubordinates = false;
      return;
    }

    const headers = this.getAuthHeaders();

    this.http.get<UserDto[]>(`/api/manager/subordinates`, {
      params: { managerId: this.managerId },
      ...headers
    }).pipe(
      catchError(error => {
        console.error('Erro ao buscar subordinados:', error);
        this.errorLoadingSubordinates = 'Falha ao carregar subordinados.';
        return of([]); // Retorna um array vazio em caso de erro
      })
    ).subscribe({
      next: (subs: UserDto[]) => {
        console.log('Subordinados carregados:', subs);
        if (this.errorLoadingSubordinates) { // Se houve erro no pipe
          this.loadingSubordinates = false;
          return;
        }
        // Inicializa o array com estado padrão para cada subordinado
        this.subordinatesWithState = subs.map(sub => ({
          ...sub,
          loadingDemands: false,
          errorLoadingDemands: null
        }));
        this.loadingSubordinates = false;
      },
      error: (err) => { // Erro no subscribe (menos provável aqui por causa do catchError)
        console.error('Erro inesperado ao processar subordinados:', err);
        this.errorLoadingSubordinates = 'Ocorreu um erro ao processar os dados dos subordinados.';
        this.loadingSubordinates = false;
      }
    });
  }

  // Novo método: Carrega as demandas de um subordinado específico
  loadDemandsForSubordinate(subordinateId: string): void {
    // Encontre o subordinado no array
    const subordinate = this.subordinatesWithState.find(sub => sub.id === subordinateId);

    // Se não encontrar ou já estiver carregando, retorne
    if (!subordinate || subordinate.loadingDemands) {
      return;
    }

    // Atualize o estado para "carregando"
    subordinate.loadingDemands = true;
    subordinate.errorLoadingDemands = null; // Limpa erros anteriores
    subordinate.demands = undefined; // Limpa demandas anteriores se houver

    const headers = this.getAuthHeaders();

    // --- CORREÇÃO AQUI ---
    // Chama o endpoint descomentado: GET /api/demands/user/{subordinateId}
    // O 'subordinateId' agora faz parte da URL, não dos parâmetros.
    this.http.get<Demand[]>(`/api/demands/user/${subordinateId}`, headers) // <-- URL modificada
      .pipe(
        catchError(error => {
          console.error(`Erro ao buscar demandas para subordinado ${subordinateId}:`, error);
          // Atualize o estado para "erro"
          subordinate.errorLoadingDemands = 'Falha ao carregar demandas.';
          return of([]); // Retorna um array vazio em caso de erro
        })
      ).subscribe({
      next: (demands: Demand[]) => {
        console.log(`Demandas carregadas para subordinado ${subordinateId}:`, demands);
        // Atualize o estado para "concluído" e armazene as demandas
        subordinate.demands = demands;
        subordinate.loadingDemands = false;
      },
      error: (err) => { // Erro no subscribe
        console.error(`Erro inesperado ao processar demandas para subordinado ${subordinateId}:`, err);
        subordinate.errorLoadingDemands = 'Ocorreu um erro ao processar as demandas.';
        subordinate.loadingDemands = false;
      }
    });
  }

  // Método opcional para recarregar as demandas de um subordinado
  reloadDemandsForSubordinate(subordinateId: string): void {
    this.loadDemandsForSubordinate(subordinateId);
  }

  // Método opcional para limpar as demandas carregadas de um subordinado
  clearDemandsForSubordinate(subordinateId: string): void {
    const subordinate = this.subordinatesWithState.find(sub => sub.id === subordinateId);
    if (subordinate) {
      subordinate.demands = undefined;
      subordinate.errorLoadingDemands = null;
      // Não alteramos loadingDemands aqui, pois não está carregando
    }
  }
}
