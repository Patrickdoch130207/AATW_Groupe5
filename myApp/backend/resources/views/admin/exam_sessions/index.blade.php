@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des sessions d'examen</h1>
        <form action="{{ route('admin.exam-sessions.create') }}" method="GET" style="display: inline;">
            <button type="submit" class="btn btn-primary">
                Nouvelle session
            </button>
        </form>
    </div>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Période</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($sessions as $session)
                    <tr>
                        <td>{{ $session->name }}</td>
                        <td>
                            {{ $session->start_date->format('d/m/Y') }} - 
                            {{ $session->end_date->format('d/m/Y') }}
                        </td>
                        <td>
                            <span class="badge bg-{{ [
                                'preparation' => 'secondary',
                                'open' => 'success',
                                'closed' => 'danger',
                                'deliberation' => 'warning',
                                'completed' => 'info'
                            ][$session->status] ?? 'secondary' }}">
                                {{ ucfirst($session->status) }}
                            </span>
                        </td>
                        <td>
                            @if($session->status === 'preparation')
                                <form action="{{ route('admin.exam-sessions.open', $session) }}" 
                                      method="POST" class="d-inline">
                                    @csrf
                                    <button type="submit" class="btn btn-sm btn-success">
                                        Ouvrir
                                    </button>
                                </form>
                            @elseif($session->status === 'open')
                                <form action="{{ route('admin.exam-sessions.close', $session) }}" 
                                      method="POST" class="d-inline">
                                    @csrf
                                    <button type="submit" class="btn btn-sm btn-warning">
                                        Fermer
                                    </button>
                                </form>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection