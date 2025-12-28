@extends('layouts.app')

@section('content')
<div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1 style="margin-bottom: 20px;">Nouvelle session d'examen</h1>
    
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <form method="POST" action="{{ route('admin.exam-sessions.store') }}">
            @csrf

            <div style="margin-bottom: 15px;">
                <label for="name" style="display: block; margin-bottom: 5px; font-weight: bold;">Nom de la session *</label>
                <input type="text" 
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                       id="name" 
                       name="name" 
                       value="{{ old('name') }}" 
                       required
                       autofocus>
                @error('name')
                    <div style="color: red; font-size: 14px; margin-top: 5px;">{{ $message }}</div>
                @enderror
                                       <div style="margin-bottom: 15px;">
                <label for="start_date" style="display: block; margin-bottom: 5px; font-weight: bold;">Date de début *</label>
                <input type="date" 
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                       id="start_date" 
                       name="start_date" 
                       value="{{ old('start_date') }}" 
                       required>
                @error('start_date')
                    <div style="color: red; font-size: 14px; margin-top: 5px;">{{ $message }}</div>
                @enderror
            </div>

            <div style="margin-bottom: 15px;">
                <label for="end_date" style="display: block; margin-bottom: 5px; font-weight: bold;">Date de fin *</label>
                <input type="date" 
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                       id="end_date" 
                       name="end_date" 
                       value="{{ old('end_date') }}" 
                       required>
                @error('end_date')
                    <div style="color: red; font-size: 14px; margin-top: 5px;">{{ $message }}</div>
                @enderror
            </div>

            <div style="margin-top: 20px; text-align: right;">
                <a href="{{ route('admin.exam-sessions.index') }}" style="margin-right: 10px; padding: 8px 16px; background: #6c757d; color: white; text-decoration: none; border-radius: 4px;">
                    Annuler
                </a>
                <button type="submit" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Créer la session
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
// Validation des dates
document.addEventListener('DOMContentLoaded', function() {
    const startDate = document.getElementById('start_date');
    const endDate = document.getElementById('end_date');
    
    if (startDate && endDate) {
        // Définir la date minimale pour aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        startDate.min = today;
        
        // Mettre à jour la date de fin quand la date de début change
        startDate.addEventListener('change', function() {
            if (startDate.value) {
                endDate.min = startDate.value;
                if (endDate.value && endDate.value < startDate.value) {
                    endDate.value = startDate.value;
                }
            }
        });
    }
});
</script>
@endpush
@endsection