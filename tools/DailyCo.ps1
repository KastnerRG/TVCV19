Add-Type -Path '..\frontend\TvCv19.Frontend\bin\Debug\netcoreapp3.1\TvCv19.DailyCo.Client.dll'

$dailyCoToken = 'insert-Daily.co-API-key'

function Get-DailyCoRoom {
    [CmdletBinding(DefaultParameterSetName='None')]
    param(
        [Parameter(ParameterSetName='NamedRoom', Mandatory=$true, ValueFromPipeline=$true)]
        [string]$Name
    )

    PROCESS {
        $client = New-Object -TypeName TvCv19.DailyCo.Client.RoomClient -ArgumentList $dailyCoToken

        switch ($PsCmdlet.ParameterSetName) {
            'None' {
                $returnValue = $client.GetRoomsAsync().Result
            }
            'NamedRoom' {
                $returnValue = $client.GetRoomAsync($Name).Result
            }
        }

        $client.Dispose()

        $returnValue
    }
}

function New-DailyCoRoom {
    param(
        [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
        [string]$Name
    )

    PROCESS {
        $client = New-Object -TypeName TvCv19.DailyCo.Client.RoomClient -ArgumentList $dailyCoToken

        $room = New-Object -TypeName TvCv19.DailyCo.Client.Models.Room
        $room.Name = $Name

        $returnValue = $client.CreateRoomAsync($room).Result

        $client.Dispose()

        $returnValue
    }
}