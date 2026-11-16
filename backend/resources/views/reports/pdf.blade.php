<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #222;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
        }

        .header h1 {
            font-size: 20px;
            margin-bottom: 5px;
        }

        .meta {
            margin-bottom: 20px;
            line-height: 1.8;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 9px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .footer {
            margin-top: 25px;
            font-size: 9px;
            text-align: center;
            color: #777;
        }
    </style>
</head>

<body>

    <div class="header">
        <h1>Queue Ease</h1>
        <strong>{{ $title }}</strong>
    </div>

    <div class="meta">
        <strong>Report Type:</strong>
        {{ ucfirst($type) }}
        <br>

        <strong>Date From:</strong>
        {{ $filters['from'] ?? 'Not specified' }}
        <br>

        <strong>Date To:</strong>
        {{ $filters['to'] ?? 'Not specified' }}
        <br>

        <strong>Generated:</strong>
        {{ $generatedAt->format('F d, Y h:i A') }}
    </div>

    <table>
        @foreach ($rows as $index => $row)
            <tr>
                @foreach ($row as $cell)
                    @if ($index === 0)
                        <th>{{ $cell }}</th>
                    @else
                        <td>{{ $cell ?? 'N/A' }}</td>
                    @endif
                @endforeach
            </tr>
        @endforeach
    </table>

    <div class="footer">
        Queue Ease — Generated administrative report
    </div>

</body>
</html>